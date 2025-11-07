package com.tus.microservices.security;


import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.web.server.ServerWebExchange;

import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import reactor.core.publisher.Mono;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class JwtAuthFilter implements ServerSecurityContextRepository {

	 private final JwtUtil jwtUtil;

	    public JwtAuthFilter(JwtUtil jwtUtil) {
	        this.jwtUtil = jwtUtil;
	    }
	    
	    @Override
	    public Mono<Void> save(ServerWebExchange exchange, SecurityContext context) {
	        return Mono.empty(); // Not needed for stateless JWT authentication
	    }

	    @Override
	    public Mono<SecurityContext> load(ServerWebExchange exchange) {
	        ServerHttpRequest request = exchange.getRequest();
	        String token = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

	        if (token != null && token.startsWith("Bearer ")) {
	            token = token.substring(7);
	            log.info("Extracted JWT Token: {}", token);

	            if (jwtUtil.validateToken(token)) {
	                String username = jwtUtil.extractUsername(token);
	                log.info("Authenticated user: {}", username);

	                UserDetails userDetails = User.withUsername(username)
	                        .password("")
	                        .roles("USER")
	                        .build();

	                Authentication authentication = new UsernamePasswordAuthenticationToken(
	                        userDetails, token, userDetails.getAuthorities()
	                );

	                return Mono.just(new SecurityContextImpl(authentication));
	            } else {
	                log.warn("Invalid JWT token!");
	            }
	        } else {
	            log.warn("Authorization header missing or malformed!");
	        }

	        return Mono.empty();
	    }
}

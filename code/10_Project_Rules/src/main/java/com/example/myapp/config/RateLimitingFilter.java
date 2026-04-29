package com.example.myapp.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public final class RateLimitingFilter implements Filter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitingFilter.class);

    private final int maxRequests;
    private final long windowMillis;
    private final Map<String, Counter> counters = new ConcurrentHashMap<>();

    public RateLimitingFilter(int maxRequests, long windowMillis) {
        this.maxRequests = maxRequests;
        this.windowMillis = windowMillis;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        String ip = extractClientIp(req);
        long now = System.currentTimeMillis();
        Counter counter = counters.compute(ip, (key, existing) -> {
            if (existing == null || now - existing.windowStart >= windowMillis) {
                return new Counter(1, now);
            } else {
                existing.count++;
                return existing;
            }
        });
        if (counter.count > maxRequests) {
            log.warn("Rate limit exceeded for IP {}", ip);
            res.setStatus(429);
            res.getWriter().write("Too Many Requests");
            return;
        }
        chain.doFilter(request, response);
    }

    private String extractClientIp(HttpServletRequest req) {
        String header = req.getHeader("X-Forwarded-For");
        if (header != null && !header.isBlank()) {
            return header.split(",")[0].trim();
        }
        return req.getRemoteAddr();
    }

    private static final class Counter {
        int count;
        long windowStart;

        Counter(int count, long windowStart) {
            this.count = count;
            this.windowStart = windowStart;
        }
    }
}


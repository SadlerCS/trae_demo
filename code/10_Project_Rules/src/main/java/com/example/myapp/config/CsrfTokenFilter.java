package com.example.myapp.config;

import com.example.myapp.service.CsrfService;
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

public final class CsrfTokenFilter implements Filter {

    private static final Logger log = LoggerFactory.getLogger(CsrfTokenFilter.class);

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        String token = req.getHeader("X-CSRF-Token");
        if (token == null || !CsrfService.isValid(token)) {
            log.warn("Invalid or missing CSRF token");
            res.setStatus(403);
            res.getWriter().write("Forbidden");
            return;
        }
        chain.doFilter(request, response);
    }
}


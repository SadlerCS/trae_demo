package com.example.myapp.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public final class WebConfig {

    @Bean
    public FilterRegistrationBean<RateLimitingFilter> rateLimitingFilter() {
        FilterRegistrationBean<RateLimitingFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new RateLimitingFilter(5, 60_000));
        registrationBean.addUrlPatterns("/api/register");
        registrationBean.setOrder(1);
        return registrationBean;
    }

    @Bean
    public FilterRegistrationBean<CsrfTokenFilter> csrfTokenFilter() {
        FilterRegistrationBean<CsrfTokenFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new CsrfTokenFilter());
        registrationBean.addUrlPatterns("/api/register");
        registrationBean.setOrder(2);
        return registrationBean;
    }
}


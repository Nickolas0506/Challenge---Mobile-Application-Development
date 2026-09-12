package br.com.fiap.solin.config;

import br.com.fiap.solin.auth.JwtAuthFilter;
import br.com.fiap.solin.auth.JwtService;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FiltroConfig {

    @Bean
    public FilterRegistrationBean<JwtAuthFilter> jwtFilter(JwtService jwt) {
        FilterRegistrationBean<JwtAuthFilter> bean = new FilterRegistrationBean<>(new JwtAuthFilter(jwt));
        bean.addUrlPatterns("/api/*");
        bean.setOrder(1);
        return bean;
    }
}

package br.com.fiap.solin.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** /distribuicao/ abre a pagina do testador (static/distribuicao/index.html), mantendo o ?c= do convite. */
@Configuration
public class DistribuicaoPaginasConfig implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/distribuicao/").setViewName("forward:/distribuicao/index.html");
        registry.addViewController("/distribuicao/painel").setViewName("forward:/distribuicao/painel.html");
    }
}

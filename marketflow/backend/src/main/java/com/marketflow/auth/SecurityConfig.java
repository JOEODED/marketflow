package com.marketflow.auth;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
@Configuration @EnableMethodSecurity public class SecurityConfig{
 @Bean SecurityFilterChain chain(HttpSecurity http,JwtFilter f)throws Exception{
  http.csrf(c->c.disable()).cors(Customizer.withDefaults()).sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
   .authorizeHttpRequests(a->a.requestMatchers("/api/auth/**","/v3/api-docs/**","/swagger-ui/**","/swagger-ui.html").permitAll().anyRequest().authenticated())
   .exceptionHandling(e->e.authenticationEntryPoint((q,r,x)->r.sendError(401)))
   .addFilterBefore(f,UsernamePasswordAuthenticationFilter.class);return http.build();}
 @Bean PasswordEncoder encoder(){return new BCryptPasswordEncoder();}
 @Bean CorsConfigurationSource cors(@Value("${app.cors-origin}") String o){CorsConfiguration c=new CorsConfiguration();c.setAllowedOrigins(List.of(o));c.setAllowedMethods(List.of("*"));c.setAllowedHeaders(List.of("*"));UrlBasedCorsConfigurationSource s=new UrlBasedCorsConfigurationSource();s.registerCorsConfiguration("/**",c);return s;}
}

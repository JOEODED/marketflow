package com.marketflow.auth;
import com.marketflow.common.AuthUser;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.*;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
@Service public class JwtService{
 private final SecretKey key;private final long ttl;
 public JwtService(@Value("${app.jwt.secret}") String s,@Value("${app.jwt.ttl-minutes}") long m){key=Keys.hmacShaKeyFor(s.getBytes(StandardCharsets.UTF_8));ttl=m*60000;}
 public String create(AuthUser u){return Jwts.builder().subject(u.userId().toString()).claim("bid",u.businessId().toString()).claim("role",u.role()).expiration(new Date(System.currentTimeMillis()+ttl)).signWith(key).compact();}
 public AuthUser parse(String t){Claims c=Jwts.parser().verifyWith(key).build().parseSignedClaims(t).getPayload();return new AuthUser(UUID.fromString(c.getSubject()),UUID.fromString(c.get("bid",String.class)),c.get("role",String.class));}
}

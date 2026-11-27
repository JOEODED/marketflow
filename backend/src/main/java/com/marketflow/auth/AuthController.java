package com.marketflow.auth;
import com.marketflow.businesses.*;
import com.marketflow.common.*;
import com.marketflow.users.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth") public class AuthController{
 public record RegisterReq(@NotBlank String businessName,@NotBlank String fullName,@Email @NotBlank String email,@Size(min=8) String password){}
 public record LoginReq(@Email @NotBlank String email,@NotBlank String password){}
 public record AuthRes(String token,String role,String fullName,UUID businessId){}
 private final UserRepository users;private final BusinessRepository businesses;private final PasswordEncoder enc;private final JwtService jwt;
 public AuthController(UserRepository u,BusinessRepository b,PasswordEncoder e,JwtService j){users=u;businesses=b;enc=e;jwt=j;}
 @PostMapping("/register") @Transactional @ResponseStatus(HttpStatus.CREATED) public AuthRes register(@Valid @RequestBody RegisterReq r){
  String email=r.email().toLowerCase();
  if(users.existsByEmail(email)) throw new ApiException(HttpStatus.CONFLICT,"Email already registered");
  Business b=new Business();b.name=r.businessName();b=businesses.save(b);
  User u=new User();u.businessId=b.id;u.email=email;u.passwordHash=enc.encode(r.password());u.fullName=r.fullName();u.role="BUSINESS_OWNER";
  return res(users.save(u));}
 @PostMapping("/login") public AuthRes login(@Valid @RequestBody LoginReq r){
  User u=users.findByEmail(r.email().toLowerCase()).filter(x->enc.matches(r.password(),x.passwordHash)).orElseThrow(()->new ApiException(HttpStatus.UNAUTHORIZED,"Invalid email or password"));
  return res(u);}
 private AuthRes res(User u){return new AuthRes(jwt.create(new AuthUser(u.id,u.businessId,u.role)),u.role,u.fullName,u.businessId);}
}

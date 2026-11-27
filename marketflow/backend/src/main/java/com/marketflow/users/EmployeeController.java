package com.marketflow.users;
import com.marketflow.common.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/employees") @PreAuthorize("hasRole('BUSINESS_OWNER')") public class EmployeeController{
 public record EmployeeReq(@NotBlank String fullName,@Email @NotBlank String email,@Size(min=8) String password,@Pattern(regexp="MANAGER|CASHIER") String role){}
 public record EmployeeRes(java.util.UUID id,String fullName,String email,String role){}
 private final UserRepository users;private final PasswordEncoder enc;
 public EmployeeController(UserRepository u,PasswordEncoder e){users=u;enc=e;}
 @GetMapping public List<EmployeeRes> list(){return users.findByBusinessId(AuthUser.current().businessId()).stream().map(u->new EmployeeRes(u.id,u.fullName,u.email,u.role)).toList();}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public EmployeeRes add(@Valid @RequestBody EmployeeReq r){
  if(users.existsByEmail(r.email().toLowerCase())) throw new ApiException(HttpStatus.CONFLICT,"Email already registered");
  User u=new User();u.businessId=AuthUser.current().businessId();u.email=r.email().toLowerCase();u.passwordHash=enc.encode(r.password());u.fullName=r.fullName();u.role=r.role();users.save(u);
  return new EmployeeRes(u.id,u.fullName,u.email,u.role);}
}

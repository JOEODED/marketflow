package com.marketflow.expenses;
import com.marketflow.common.AuthUser;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/expenses") @PreAuthorize("hasAnyRole('BUSINESS_OWNER','MANAGER')") public class ExpenseController{
 public record ExpenseReq(@NotBlank String category,String description,@NotNull @Positive BigDecimal amount,String paymentMethod,@NotNull LocalDate expenseDate){}
 private final ExpenseRepository repo;public ExpenseController(ExpenseRepository r){repo=r;}
 @GetMapping public List<Expense> list(@RequestParam(required=false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate from,@RequestParam(required=false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate to){
  return repo.findByBusinessIdAndExpenseDateBetweenOrderByExpenseDateDesc(AuthUser.current().businessId(),from==null?LocalDate.of(2000,1,1):from,to==null?LocalDate.of(2100,1,1):to);}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public Expense create(@Valid @RequestBody ExpenseReq r){
  Expense e=new Expense();e.businessId=AuthUser.current().businessId();e.category=r.category();e.description=r.description();e.amount=r.amount();e.paymentMethod=r.paymentMethod();e.expenseDate=r.expenseDate();return repo.save(e);}
}

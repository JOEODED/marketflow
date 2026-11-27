package com.marketflow.reports;
import com.marketflow.common.AuthUser;
import com.marketflow.expenses.ExpenseRepository;
import com.marketflow.products.ProductRepository;
import com.marketflow.sales.SaleRepository;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/dashboard") public class DashboardController{
 public record Dashboard(BigDecimal salesToday,BigDecimal salesThisMonth,BigDecimal grossProfitThisMonth,BigDecimal expensesThisMonth,BigDecimal netThisMonth,long products,long lowStock,long outOfStock){}
 private static final ZoneId LAGOS=ZoneId.of("Africa/Lagos");
 private final SaleRepository sales;private final ExpenseRepository expenses;private final ProductRepository products;
 public DashboardController(SaleRepository s,ExpenseRepository e,ProductRepository p){sales=s;expenses=e;products=p;}
 @GetMapping public Dashboard get(){
  UUID b=AuthUser.current().businessId();LocalDate today=LocalDate.now(LAGOS),first=today.withDayOfMonth(1);
  var todayStart=today.atStartOfDay(LAGOS).toInstant();var monthStart=first.atStartOfDay(LAGOS).toInstant();
  BigDecimal rev=sales.revenueSince(b,monthStart),gross=rev.subtract(sales.cogsSince(b,monthStart)),exp=expenses.totalSince(b,first);
  return new Dashboard(sales.revenueSince(b,todayStart),rev,gross,exp,gross.subtract(exp),products.countByBusinessIdAndArchivedFalse(b),products.lowStock(b),products.outOfStock(b));}
}

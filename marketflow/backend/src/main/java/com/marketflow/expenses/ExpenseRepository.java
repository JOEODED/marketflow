package com.marketflow.expenses;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
public interface ExpenseRepository extends JpaRepository<Expense,UUID>{
 List<Expense> findByBusinessIdAndExpenseDateBetweenOrderByExpenseDateDesc(UUID b,LocalDate from,LocalDate to);
 @Query("select coalesce(sum(e.amount),0) from Expense e where e.businessId=:b and e.expenseDate>=:from") BigDecimal totalSince(@Param("b") UUID b,@Param("from") LocalDate from);
}

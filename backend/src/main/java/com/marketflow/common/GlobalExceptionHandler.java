package com.marketflow.common;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
@RestControllerAdvice public class GlobalExceptionHandler{
 @ExceptionHandler(ApiException.class) ResponseEntity<Map<String,String>> api(ApiException e){return ResponseEntity.status(e.status).body(Map.of("error",e.getMessage()));}
 @ExceptionHandler(DataIntegrityViolationException.class) ResponseEntity<Map<String,String>> dup(){return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error","That record already exists (for example, a duplicate SKU)."));}
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<Map<String,String>> bad(MethodArgumentNotValidException e){return ResponseEntity.badRequest().body(Map.of("error",e.getBindingResult().getFieldErrors().stream().map(f->f.getField()+" "+f.getDefaultMessage()).collect(Collectors.joining("; "))));}
}

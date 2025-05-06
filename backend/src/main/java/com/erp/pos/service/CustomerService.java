package com.erp.pos.service;

import com.erp.pos.model.Customer;

import java.util.List;
import java.util.Optional;

public interface CustomerService {
    List<Customer> getAllCustomers();
    Customer getCustomerById(Long id);
    Optional<Customer> getCustomerByEmail(String email);
    Optional<Customer> getCustomerByPhone(String phone);
    List<Customer> searchCustomers(String name);
    Customer createCustomer(Customer customer);
    Customer updateCustomer(Long id, Customer customer);
    void deleteCustomer(Long id);
}

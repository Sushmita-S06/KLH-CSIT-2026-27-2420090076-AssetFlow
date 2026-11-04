package com.assetflow.service;

import com.assetflow.entity.Category;
import com.assetflow.exception.BadRequestException;
import com.assetflow.exception.ResourceNotFoundException;
import com.assetflow.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository repo;

    public List<Category> getAll() { return repo.findAll(); }

    public Category create(Category c) {
        if (c.getName() == null || c.getName().isBlank())
            throw new BadRequestException("Name is required");
        if (repo.existsByName(c.getName()))
            throw new BadRequestException("Category already exists");
        return repo.save(c);
    }

    public Category update(Long id, Category c) {
        Category existing = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        existing.setName(c.getName());
        existing.setDescription(c.getDescription());
        return repo.save(existing);
    }

    public void delete(Long id) {
        if (!repo.existsById(id))
            throw new ResourceNotFoundException("Category not found");
        repo.deleteById(id);
    }
}
package com.example.ims.features.history.repostories;

import com.example.ims.features.history.entities.History;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistoryRepository extends JpaRepository<History, Long> {}

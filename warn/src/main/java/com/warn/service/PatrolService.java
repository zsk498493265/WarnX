package com.warn.service;

import com.warn.entity.AutoValue;

import java.io.IOException;
import java.util.List;

public interface PatrolService {
    void addPatrolRecords() throws IOException;

    List<Integer> getOldIds();

    List<AutoValue> getOldsStatus();
}

package com.warn.service;

import com.warn.dto.Result;
import com.warn.entity.AutoValue;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

public interface PatrolService {
    void addPatrolRecords() throws IOException, ParseException;

    List<Integer> getOldIds();

    List<AutoValue> getOldsStatus();

    Result checkRecords();
}

package com.warn.dao;

import com.warn.entity.Cookie;
import com.warn.entity.Patrol;

import java.util.List;

public interface PatrolDao {
    void addPatrolRecords(Patrol patrol);

    Cookie getCookie();

    Patrol getLatestRecord();

    List<Patrol> getAllRecords();

    List<Patrol> getRecordsByPoint(String point);

    Integer getOldIdByRecord(Integer point);

    String getMaxTimeByWorker(String worker);

    String getMaxTimeByWorkerAndPoint(String worker,Integer point);

    void addData(String worker,Integer point);

    Integer getPointByTime(String time);

    List<Integer> getPoints();

    List<Integer> getPointsByWorker(String worker);

    Long getSizeOfPoint(Integer point);

    Integer getOidByPoint(Integer point);

    void deleteDuplicate();

    void deleteNull();


}

package com.warn.service.impl;

import com.sun.xml.internal.ws.policy.privateutil.PolicyUtils;
import com.warn.dao.DataDao;
import com.warn.dao.PatrolDao;
import com.warn.dto.Result;
import com.warn.dto.Urgency;
import com.warn.entity.AutoValue;
import com.warn.entity.Cookie;
import com.warn.entity.OldMan;
import com.warn.entity.Patrol;
import com.warn.service.PatrolService;
import com.warn.util.common.Const;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.directwebremoting.json.types.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.lang.reflect.Array;
import java.net.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class PatrolServiceImpl implements PatrolService {

    @Autowired
    PatrolDao patrolDao;
    @Autowired
    DataDao dataDao;

    @Transactional
    public void addPatrolRecords() throws IOException,ParseException{
        URL url = new URL("http://www.5ixun.com/exun/checkpointLog/query");
        String errorStr = "";
        String status = "";
        String response = "";
        DataOutputStream out = null;
        BufferedReader in = null;
        StringBuffer buffer = new StringBuffer();
        Cookie cookie = patrolDao.getCookie();
        Date d = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try{
            URLConnection conn = url.openConnection();
            HttpURLConnection httpUrlConnection = (HttpURLConnection) conn;
            httpUrlConnection.setRequestProperty("Content-Type","application/x-www-form-urlencoded");
            httpUrlConnection.addRequestProperty("Cookie","from=" + cookie.getFrom());
            httpUrlConnection.addRequestProperty("Cookie","secret=" + cookie.getSecret());
            httpUrlConnection.addRequestProperty("Cookie","smuser=" + cookie.getSmuser());
            sdf.setTimeZone(TimeZone.getTimeZone("Asia/Shanghai"));
            String today = sdf.format(d);
            String morning = today.split(" ")[0] + " " + "00:00:00";
            String night= today.split(" ")[0] + " "+ "23:59:59";
            Long startTime = sdf.parse(morning).getTime();
            Long endTime = sdf.parse(night).getTime();
            String content = "startTime="+URLEncoder.encode(startTime.toString(),"UTF-8");
            content+= "&endTime="+URLEncoder.encode(endTime.toString(),"UTF-8");
            content+="&limit="+URLEncoder.encode("100","UTF-8");
            httpUrlConnection.setDoOutput(true);
            httpUrlConnection.setDoInput(true);
            httpUrlConnection.setRequestMethod("POST");
            httpUrlConnection.setUseCaches(false);
            httpUrlConnection.connect();
            out =  new DataOutputStream(httpUrlConnection
                    .getOutputStream());
            out.writeBytes(content);
            // 发送请求参数
            // flush输出流的缓冲
            out.flush();

            // 定义BufferedReader输入流来读取URL的响应
            in = new BufferedReader(new InputStreamReader(httpUrlConnection.getInputStream(),"utf-8"));
            String line;
            while ((line = in.readLine()) != null) {
                response += line;
            }
            status = new Integer(httpUrlConnection.getResponseCode()).toString();
        } catch (Exception e) {
            System.out.println("发送 POST 请求出现异常！" + e);
            errorStr = e.getMessage();
        }
        // 使用finally块来关闭输出流、输入流
        finally {
            try {
                if (out != null) { out.close();}
                if (in != null) {in.close();}
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
        JSONObject object = JSONObject.fromObject(response);
        JSONArray json = object.getJSONArray("rows");
        Patrol patrol1 = patrolDao.getLatestRecord();
        List<Patrol> patrols = new ArrayList<>();
        for(int i=0;i<json.size();i++){
            Patrol patrol = new Patrol();
            patrol.setWorker(json.getJSONObject(i).getString("patrolmanId"));
            patrol.setTime(Const.longToDate(new Long(json.getJSONObject(i).getString("createTime"))));
            JSONObject jsonObject =(JSONObject) json.getJSONObject(i).get("checkpoint");
            patrol.setPoint(jsonObject.get("name").toString());
            patrol.setCardNo(jsonObject.get("card").toString());
            JSONObject jsonObject1 = (JSONObject) json.getJSONObject(i).get("device");
            patrol.setMachineName(jsonObject1.getString("name"));
            patrol.setMachineNo(jsonObject1.getString("code"));
            patrols.add(patrol);
        }
        Collections.sort(patrols, new Comparator<Patrol>() {
            @Override
            public int compare(Patrol o1, Patrol o2) {
                return o1.getTime().compareTo(o2.getTime());
            }
        });
        int key = 1;
        if(patrol1 == null)
            for(int i=0;i<json.size();i++){
                Patrol patrol = new Patrol();
                patrol.setWorker(json.getJSONObject(i).getString("patrolmanId"));
                patrol.setTime(Const.longToDate(new Long(json.getJSONObject(i).getString("createTime"))));
                JSONObject jsonObject =(JSONObject) json.getJSONObject(i).get("checkpoint");
                patrol.setPoint(jsonObject.get("name").toString());
                patrol.setCardNo(jsonObject.get("card").toString());
                JSONObject jsonObject1 = (JSONObject) json.getJSONObject(i).get("device");
                patrol.setMachineName(jsonObject1.getString("name"));
                patrol.setMachineNo(jsonObject1.getString("code"));
                patrolDao.addPatrolRecords(patrol);
            }
        else
            for(int i=0;i<json.size();i++){
                Long time = sdf.parse(patrols.get(i).getTime()).getTime();
                Long ptime  = sdf.parse(patrol1.getTime()).getTime();
                if(ptime < time)
                    key = 0;
                if(key == 0)
                    patrolDao.addPatrolRecords(patrols.get(i));

            }
            patrolDao.deleteDuplicate();
            patrolDao.deleteNull();

    }
    @Override
    public Result checkRecords(){
        List<Patrol> patrols = patrolDao.getAllRecords();
        List<Integer>point_list=new ArrayList<Integer>();
        Map<String,Integer> worker = new HashMap<>();
        Map<String,Integer> point = new HashMap<>();
        Integer[][] num = new Integer[patrols.size()][patrols.size()];
        List<String>errorWorkers=new ArrayList<String>();

        Set<String>keySet;
        for(int n=0;n<patrols.size();n++)
            for(int j=0;j<patrols.size();j++)
                num[n][j] = 0;
         Integer i = 0,j = 0;
        for(Patrol patrol:patrols){
            if(!worker.containsKey(patrol.getWorker()))
                worker.put(patrol.getWorker(),i++);
            if(!point.containsKey(patrol.getPoint()))
            {
                point.put(patrol.getPoint(),j++);
                if(patrol.getPoint()!=null)
                point_list.add(Integer.parseInt(patrol.getPoint()));
            }

            num[worker.get(patrol.getWorker())][point.get(patrol.getPoint())]++;
        }

        for(int n=0;n<patrols.size();n++){
            Integer service = 0;
            for(int k=0;k<patrols.size();k++){
                if(!(num[n][k] % 2 == 0)){
                    service++;
                }
            }
            if(service>=2)
            {
                keySet=worker.keySet();
                Iterator<String> it = keySet.iterator();
                while(it.hasNext()) {                //判断集合是否有元素
                    String key = it.next();         //获取每一个键
                    Integer value = worker.get(key);
                    if(value==n)
                        errorWorkers.add(key);
                }
            }

        }

        for(String workerId:errorWorkers){
            List<Integer> points = patrolDao.getPointsByWorker(workerId);
            String max_time="2018-01-01 00:00:00";

            for(i=0;i<patrols.size();i++){
                if(i== Integer.valueOf(workerId)){
                    for(j=0;j<patrols.size();j++){
                        if(num[i][j]%2!=0){
                            Integer oid = patrolDao.getOidByPoint(j);
                            OldMan oldMan = new OldMan();
                            oldMan.setOid(oid);
                            oldMan.setStatus(0);
                            dataDao.editOldManStatus(oldMan);
                            //patrolDao.addData(workerId,j);
                            if(patrolDao.getMaxTimeByWorkerAndPoint(workerId,j).compareTo(max_time)>0){
                                max_time=patrolDao.getMaxTimeByWorker(workerId);
                            }
                        }
                    }

                }
            }

            //String maxTime=patrolDao.getMaxTimeByWorker(workerId);
            Integer point2=patrolDao.getPointByTime(max_time);
            Integer oid = patrolDao.getOidByPoint(point2);
            OldMan oldMan = new OldMan();
            oldMan.setOid(oid);
            oldMan.setStatus(1);
            dataDao.editOldManStatus(oldMan);
            //patrolDao.addData(workerId,point2);

        }
        for(Integer point1:point_list){
            List<Patrol> patrols2 = patrolDao.getRecordsByPoint(point1.toString());

            String lastWorker=patrols2.get(patrols2.size()-1).getWorker();
            int cnt=0;
            for(Patrol p:patrols){
                if(p.getWorker().equals(lastWorker)){
                    cnt++;
                }
            }
            if(cnt%2==0){
                Integer oid = patrolDao.getOidByPoint(Integer.parseInt(patrols2.get(patrols2.size()-1).getPoint()));
                OldMan oldMan = new OldMan();
                oldMan.setOid(oid);
                oldMan.setStatus(0);
                dataDao.editOldManStatus(oldMan);
            }





        }



            return new Result(true,"正常");
    }

    public List<Integer> getOldIds(){
        List<Patrol> patrols = patrolDao.getAllRecords();
        Set<Integer> points = new HashSet<>();
        List<Integer> oldIds = new ArrayList<>();
        for(Patrol patrol:patrols){
            Integer point  = Integer.parseInt(patrol.getPoint());
            points.add(point);
        }
        for(Integer point:points)
        {
            Integer id = patrolDao.getOldIdByRecord(point);
            oldIds.add(id);
        }
        return oldIds;
    }
    @Transactional
    public List<AutoValue> getOldsStatus(){
        List<AutoValue> oldS = new ArrayList<>();
        List<Integer> points = patrolDao.getPoints();
        for(Integer point:points){
            Integer oid = patrolDao.getOidByPoint(point);
            AutoValue autoValue = new AutoValue();
            autoValue.setNum(oid);
            Long num = patrolDao.getSizeOfPoint(point);
            OldMan oldMan = new OldMan();
            oldMan.setOid(oid);
            if(num % 2 == 0){
                autoValue.setInfo("0");
                oldMan.setStatus(0);
                dataDao.editOldManStatus(oldMan);
            }
            else{
                autoValue.setInfo("1");
                oldMan.setStatus(1);
                dataDao.editOldManStatus(oldMan);
            }
            oldS.add(autoValue);
        }
        return oldS;
    }
    @Transactional
    public void deleteNull(){
        patrolDao.deleteNull();
    }

}


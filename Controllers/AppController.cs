using DesktopAndroidMarket.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SQLite;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Tools;

namespace DesktopAndroidMarket.Controllers
{
    public class AppController : ApiController
    {
        SQLiteDBHelper sqlHelper;
        SQLiteDBHelper registerHelper;
        SQLiteDBHelper keycodeHelper;
        object sqlHelperLock = new object();
        object registerHelperLock = new object();
        object keycodeHelperLock = new object();
        ReaderWriterObjectLocker appDbLocker = new ReaderWriterObjectLocker();
        ReaderWriterObjectLocker registerDbLocker = new ReaderWriterObjectLocker();
        ReaderWriterObjectLocker keycodeDbLocker = new ReaderWriterObjectLocker();
        static byte[] key = { 19, 62, 52, 151, 89, 238, 198, 204 };
        static byte[] iv = { 43, 134, 22, 227, 186, 10, 193, 127 };
        const int LIMIT = 5;
        EnciphermentUtils enciphermentUtil = new EnciphermentUtils(key, iv);

        public Message Post([FromBody]Message value)
        {
            var content = value.Content;
            content = this.enciphermentUtil.decStringPlusBase64(content);
            var registerInfo = JsonConvert.DeserializeObject<RegisterInfo>(content);
            lock (this.registerHelperLock)
            {
                if (this.registerHelper == null)
                {
                    var appRoot = ConfigurationManager.AppSettings["AppRoot"];
                    this.registerHelper = new SQLiteDBHelper(String.Format("{0}/register/register", appRoot));
                }
            }
            lock (this.keycodeHelperLock)
            {
                if (this.keycodeHelper == null)
                {
                    var appRoot = ConfigurationManager.AppSettings["AppRoot"];
                    this.keycodeHelper = new SQLiteDBHelper(String.Format("{0}/keycode/keycode", appRoot));
                }
            }
            var sql = String.Format("select * from register where machineid = \"{0}\"", registerInfo.MachineId);
            RegisterValue registerValue = null;
            using (this.registerDbLocker.ReadLock())
            {
                using (SQLiteDataReader dr = this.registerHelper.ExecuteReader(sql))
                {
                    if (dr.Read())
                    {
                        registerValue = new RegisterValue
                        {
                            MachineId = registerInfo.MachineId,
                            KeyCode = dr["keycode"].ToString(),
                            OccupyTimes = Int16.Parse(dr["occupytimes"].ToString())
                        };
                    }
                }
            }
            if (registerValue == null)
            {
                registerValue = new RegisterValue
                {   
                    KeyCode = "",
                    OccupyTimes = 0,
                    MachineId = registerInfo.MachineId
                };
                registerValue.Message = "欢迎使用DesktopAndroid";
                //升级到正式版
                if (!String.IsNullOrEmpty(registerInfo.KeyCode))
                {
                    try2Register(registerInfo, registerValue);
                }
                using (this.registerDbLocker.WriteLock())
                {
                    var insertSql = String.Format("insert into register(machineid,keycode,occupytimes) values(\"{0}\",\"{1}\",\"{2}\")",
        registerValue.MachineId, registerValue.KeyCode, 0);
                    this.registerHelper.ExecuteNonQuery(insertSql);
                }
            }
            else
            {
                //非正式版
                if (String.IsNullOrEmpty(registerValue.KeyCode))
                {
                    if (registerValue.OccupyTimes >= LIMIT)
                    {
                        registerValue.IsLimited = true;
                        registerValue.Message = "试用已结束，请升级到正式版";
                    }
                    else
                    {
                        registerValue.Message = String.Format("你的试用次数还有{0}次", LIMIT - registerValue.OccupyTimes);
                        registerValue.OccupyTimes++;
                        using (this.registerDbLocker.WriteLock())
                        {
                            var updateSql = String.Format("update register set occupytimes = {0} where machineid = \"{1}\"", registerValue.OccupyTimes, registerValue.MachineId);
                            this.registerHelper.ExecuteNonQuery(updateSql);
                        }
                    }
                }
            }
            registerValue.Random = registerInfo.Random;
            var rspContent = JsonConvert.SerializeObject(registerValue);
            rspContent = this.enciphermentUtil.encStringPlusBase64(rspContent);
            return new Message
            {
                Content = rspContent
            };
        }

        private void try2Register(RegisterInfo registerInfo, RegisterValue registerValue)
        {
            int keycodeState = -1;
            var keycodeSql = String.Format("select * from keycode where keycode = \"{0}\"", registerInfo.KeyCode);
            using (this.keycodeDbLocker.ReadLock())
            {
                using (SQLiteDataReader dr = sqlHelper.ExecuteReader(keycodeSql))
                {
                    if (dr.Read())
                    {
                        keycodeState = Int16.Parse(dr["state"].ToString());
                    }
                }
            }
            //经过申请的keycode，可以用于注册
            if (keycodeState == 1)
            {
                registerValue.KeyCode = registerInfo.KeyCode;
                //更新keycode为已经使用
                registerValue.Message = "注册成功";
                var updateKeyCodeSql = String.Format("update keycode set state = 2 where keycode = \"{0}\"", registerInfo.KeyCode);
                using (this.keycodeDbLocker.WriteLock())
                {
                    this.sqlHelper.ExecuteNonQuery(updateKeyCodeSql);
                }
            }
            else if (keycodeState == 2)
            {
                registerValue.Message = "重复的注册码";
            }
            else
            {
                registerValue.Message = "无效的注册码";
            }
        }

        public Models.AppResult Get(int pageSize, int offSet, string searchName)
        {
            var appList = new List<Models.AppResultItem>();
            lock (this.sqlHelperLock)
            {
                if (this.sqlHelper == null)
                {
                    var appRoot = ConfigurationManager.AppSettings["AppRoot"];
                    this.sqlHelper = new SQLiteDBHelper(String.Format("{0}/app/app", appRoot));
                }
            }
            var sql = "select * from app";
            int dataSize = 0;
            using (this.appDbLocker.ReadLock())
            {
                using (SQLiteDataReader dr = sqlHelper.ExecuteReader(sql))
                {
                    while (dr.Read())
                    {
                        dataSize++;
                        var app = new Models.AppResultItem
                        {
                            id = dr["id"].ToString(),
                            name = dr["appname"].ToString(),
                            appIdMark = dr["packagename"].ToString(),
                            dlUrl = String.Format("download/{0}.dacrx", dr["appname"].ToString()),
                            url = dr["iconpath"].ToString()
                        };
                        appList.Add(app);
                    }
                }
            }
            var result = new Models.AppResult
            {
                list = appList,
                pageSize = 35,
                pageNum = (int)Math.Ceiling(dataSize / 35.0),
                dataSize = dataSize,
                offSet = 0,
                position = 0
            };
            return result;
        }
    }
}

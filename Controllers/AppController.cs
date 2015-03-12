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
        static byte[] key = { 19, 62, 52, 151, 89, 238, 198, 204 };
        static byte[] iv = { 43, 134, 22, 227, 186, 10, 193, 127 };
        const int LIMIT = 5;
        EnciphermentUtils enciphermentUtil = new EnciphermentUtils(key, iv);

        public Message Post([FromBody]Message value)
        {
            try
            {
                return doPost(value);
            }
            catch (Exception ex)
            {
                Logger.Logger.GetLogger(this).Error(ex);
                return new Message
                {
                    Content = ex.ToString()
                };
            }
        }

        private Message doPost(Message value)
        {
            var content = value.Content;
            content = this.enciphermentUtil.decStringPlusBase64(content);
            var registerInfo = JsonConvert.DeserializeObject<RegisterInfo>(content);

            var sql = String.Format("select * from register where machineid = \"{0}\"", registerInfo.MachineId);
            RegisterValue registerValue = null;
            using (DatabaseKeeper.GetInstance().RegisterDbLocker.ReadLock())
            {
                using (SQLiteDataReader dr = DatabaseKeeper.GetInstance().RegisterDBHelper.ExecuteReader(sql))
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
                    OccupyTimes = 1,
                    MachineId = registerInfo.MachineId
                };
                registerValue.Message = "欢迎使用DesktopAndroid";
                //升级到正式版
                if (!String.IsNullOrEmpty(registerInfo.KeyCode))
                {
                    try2Register(registerInfo, registerValue);
                }
                using (DatabaseKeeper.GetInstance().RegisterDbLocker.WriteLock())
                {
                    var insertSql = String.Format("insert into register(machineid,keycode,occupytimes) values(\"{0}\",\"{1}\",\"{2}\")",
        registerValue.MachineId, registerValue.KeyCode, registerValue.OccupyTimes);
                    DatabaseKeeper.GetInstance().RegisterDBHelper.ExecuteNonQuery(insertSql);
                }
            }
            else
            {
                if (String.IsNullOrEmpty(registerValue.KeyCode))
                {
                    //升级到正式版
                    if (!String.IsNullOrEmpty(registerInfo.KeyCode))
                    {
                        try2Register(registerInfo, registerValue);
                        //升级成功
                        if (!String.IsNullOrEmpty(registerValue.KeyCode))
                        {
                            using (DatabaseKeeper.GetInstance().RegisterDbLocker.WriteLock())
                            {
                                var updateSql = String.Format("update register set keycode = \"{0}\" where machineid = \"{1}\"", registerValue.KeyCode, registerValue.MachineId);
                                DatabaseKeeper.GetInstance().RegisterDBHelper.ExecuteNonQuery(updateSql);
                            }
                        }
                    }
                    else
                    {
                        if (registerValue.OccupyTimes >= LIMIT)
                        {
                            //不限制试用
                            //registerValue.IsLimited = true;
                            //registerValue.Message = "试用已结束，请升级到正式版";
                            registerValue.Message = "欢迎使用DesktopAndroid";
                        }
                        else
                        {
                            registerValue.Message = "欢迎使用DesktopAndroid";
                            //registerValue.Message = String.Format("你的试用次数还有{0}次", LIMIT - registerValue.OccupyTimes);
                            registerValue.OccupyTimes++;
                            using (DatabaseKeeper.GetInstance().RegisterDbLocker.WriteLock())
                            {
                                var updateSql = String.Format("update register set occupytimes = {0} where machineid = \"{1}\"", registerValue.OccupyTimes, registerValue.MachineId);
                                DatabaseKeeper.GetInstance().RegisterDBHelper.ExecuteNonQuery(updateSql);
                            }
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
            using (DatabaseKeeper.GetInstance().KeycodeDbLocker.ReadLock())
            {
                using (SQLiteDataReader dr = DatabaseKeeper.GetInstance().KeycodeDBHelper.ExecuteReader(keycodeSql))
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
                using (DatabaseKeeper.GetInstance().KeycodeDbLocker.WriteLock())
                {
                    DatabaseKeeper.GetInstance().KeycodeDBHelper.ExecuteNonQuery(updateKeyCodeSql);
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
            try
            {
                var appList = new List<Models.AppResultItem>();
                var sql = "select * from app";
                int dataSize = 0;
                using (DatabaseKeeper.GetInstance().AppDbLocker.ReadLock())
                {
                    using (SQLiteDataReader dr = DatabaseKeeper.GetInstance().AppDBHelper.ExecuteReader(sql))
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
            catch (Exception ex)
            {
                Logger.Logger.GetLogger(this).ErrorFormat("Exception: {0}", ex);
                return null;
            }

        }
    }
}

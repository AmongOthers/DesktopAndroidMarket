using DesktopAndroidMarket.Jsonp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;

namespace DesktopAndroidMarket.Controllers
{

    public class ValuesController : ApiController
    {
        // GET api/values
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // POST api/values
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }

        /// <summary>
        /// Get some basic information with a JSONP GET request. 
        /// </summary>
        /// <remarks>
        ///    Sample url: 
        ///    http://localhost:50211/Api/GetInformation?key=test&callback=json123123
        /// </remarks>
        /// <param name="key">key</param>
        /// <returns>JsonpResult</returns>
        //public JsonResult Get(string key)
        //{
        //    var resp = new Models.CustomObject();
        //    if (ValidateKey(key))
        //    {
        //        resp.Data = "You provided key: " + key;
        //        resp.Success = true;
        //    }
        //    else
        //    {
        //        resp.Message = "unauthorized";
        //    }
        //    return new JsonResult
        //    {
        //        Data = resp,
        //        JsonRequestBehavior = JsonRequestBehavior.AllowGet
        //    };

        //    //return this.Jsonp(resp);
        //}

        //private bool ValidateKey(string key)
        //{
        //    if (!string.IsNullOrEmpty(key))
        //        return true;
        //    return false;
        //}
    }
}
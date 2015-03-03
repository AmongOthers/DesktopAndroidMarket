using DesktopAndroidMarket.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DesktopAndroidMarket.Controllers
{
    public class UpgradeController : ApiController
    {
        int currentVersion = Int16.Parse(ConfigurationManager.AppSettings["version"]);
        string downloadPath = ConfigurationManager.AppSettings["downloadPath"];
        public UpgradeResult Get(int version)
        {
            if (version < currentVersion)
            {
                return new UpgradeResult
                {
                    Version = currentVersion,
                    DownloadPath = downloadPath
                };
            }
            return new UpgradeResult
            {
                Version = version,
                DownloadPath = String.Empty
            };
        }
    }
}

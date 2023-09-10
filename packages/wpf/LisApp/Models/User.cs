using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LisApp.Models
{
    public class User
    {
        /*
        username: string;
        password: string;
        name: string;
        permission: Permissions
        */
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string? Token { get; set; }
        public Permissions Permission { get; set; }
    }
}

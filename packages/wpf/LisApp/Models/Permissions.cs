using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LisApp.Models
{
    public enum Permissions:int
    {
        None = 0,
        View = 1,
        Edit = 2,
        Admin = 3
    }
}

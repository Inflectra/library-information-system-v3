using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LisApp.Models;

public class Book
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime? DateAdded { get; set; }
    public bool? IsOutOfPrint { get; set; }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace LisApp.Models;

public class Book
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public DateTime? DateAdded { get; set; }
    public bool? OutOfPrint { get; set; } = false;
    public int Author { get; set; }
    public int Genre { get; set; }

    [JsonIgnore]
    public string? AuthorName { get; set; }

    [JsonIgnore]
    public string? GenreName { get; set;}

    public override string ToString()
    {
        return "Book Id=" + Id;
    }
}

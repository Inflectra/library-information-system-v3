﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LisApp.Models;

public class Genre
{
    public int Id { get; set; }
    public string? Name { get; set; }

    public override string ToString()
    {
        return "Genre Id=" + Id;
    }

}

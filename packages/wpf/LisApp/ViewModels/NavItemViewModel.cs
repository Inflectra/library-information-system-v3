using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.DependencyInjection;
using CommunityToolkit.Mvvm.Messaging;
using MaterialDesignThemes.Wpf;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using LisApp.Services;

namespace LisApp.ViewModels;

public partial class NavItemViewModel: ObservableObject
{
    public Type ContentType { get; }

    [ObservableProperty]
    private string _title;

    [ObservableProperty]
    PackIconKind _selectedIcon;
    [ObservableProperty]
    PackIconKind _unselectedIcon;

    public NavItemViewModel(string title, Type contentType, PackIconKind selectedIcon, PackIconKind unselectedIcon)
    {
        _title = title;
        ContentType = contentType;
        _selectedIcon = selectedIcon;
        _unselectedIcon = unselectedIcon;
    }

}

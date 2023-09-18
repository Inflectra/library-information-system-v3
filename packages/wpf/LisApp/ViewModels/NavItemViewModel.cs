using CommunityToolkit.Mvvm.ComponentModel;
using MaterialDesignThemes.Wpf;
using System;

namespace LisApp.ViewModels;


public partial class NavItemViewModel : ObservableObject
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

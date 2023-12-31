﻿using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using CommunityToolkit.Mvvm.Messaging.Messages;
using CommunityToolkit.Mvvm.Messaging;
using MaterialDesignThemes.Wpf;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LisApp.Services;
using System.ComponentModel;
using System.Windows.Data;
using MahApps.Metro.IconPacks;
using LisApp.Views;
using LisApp.Models;
using LisApp.Properties;

namespace LisApp.ViewModels;

public partial class MainViewModel: ViewModelBase, IRecipient<PropertyChangedMessage<bool>>, IRecipient<DataErrorMessage>
{
    private readonly INavigationService navigation;
    private readonly DataService dataService;
    private readonly ICollectionView navItemsView;
    public ObservableCollection<NavItemViewModel> NavItems { get; }

    [ObservableProperty]
    private bool darkMode;

    [ObservableProperty]
    private string welcomeName = "";

    [ObservableProperty]
    private bool dialogIsOpen = false;

    [ObservableProperty]
    private string dialogMessage = "";

    [ObservableProperty]
    private bool isInProgress = false;

    [ObservableProperty]
    private bool isLoggedIn = false;

    [ObservableProperty]
    private NavItemViewModel? selectedItem;

    [ObservableProperty]
    private ViewModelBase? currentView;

    [ObservableProperty]
    private string? org = "";

    public MainViewModel(INavigationService  _navigation, DataService dataService)
    {
        navigation = _navigation;
        this.dataService = dataService;
        WeakReferenceMessenger.Default.RegisterAll(this);

        NavItems = new ObservableCollection<NavItemViewModel>()
        {
            new NavItemViewModel(
                "Login",
                typeof(LoginViewModel),
                selectedIcon: PackIconKind.Login,
                unselectedIcon: PackIconKind.Login
            ),
            new NavItemViewModel(
                "Books",
                typeof(BookListViewModel),
                selectedIcon: PackIconKind.Books,
                unselectedIcon: PackIconKind.Books
            ),
            new NavItemViewModel(
                "Authors",
                typeof(AuthorListViewModel),
                selectedIcon: PackIconKind.PeopleGroup,
                unselectedIcon: PackIconKind.PeopleGroupOutline
            )
        };
        navItemsView = CollectionViewSource.GetDefaultView(NavItems);
        navItemsView.Filter = LoggedOutNavItemsFilter;

        PropertyChanged += MainViewModel_PropertyChanged;
        navigation.PropertyChanged += Navigation_PropertyChanged;

        this.DarkMode = Settings.Default.DarkMode;

        SelectedItem = NavItems[0];
    }

    private void Navigation_PropertyChanged(object? sender, PropertyChangedEventArgs e)
    {
        if(e.PropertyName=="CurrentView")
        {
            this.CurrentView = navigation.CurrentView;
        } 
    }

    private void MainViewModel_PropertyChanged(object? sender, PropertyChangedEventArgs e)
    {
        if(e.PropertyName=="SelectedItem" && SelectedItem!=null)
        {
            navigation.NavigateTo(SelectedItem!.ContentType); ;
        }
        else if (e.PropertyName == "DarkMode")
        {
            Settings.Default.DarkMode = this.DarkMode;
            Settings.Default.Save();
            ModifyTheme(this.DarkMode);
        }
    }

    private bool LoggedOutNavItemsFilter(object obj) => obj is NavItemViewModel item &&
            (item.Title == "Home" || item.Title == "Login");
    private bool LoggedInNavItemsFilter(object obj) => obj is NavItemViewModel item &&
            (item.Title != "Login");

    public void Receive(PropertyChangedMessage<bool> message)
    {
        if (message.Sender.GetType() == typeof(DataService) &&
            message.PropertyName == nameof(DataService.IsLoggedIn))
        {
            Console.WriteLine("Login changed: "+message.NewValue);
            this.Org = "";

            if(message.NewValue)
            {
                navItemsView.Filter = LoggedInNavItemsFilter;
                this.WelcomeName = dataService!.User!.Name??"";
                this.IsLoggedIn = true;
                this.Org = dataService!.Org;
            }
            else
            {
                navItemsView.Filter = LoggedOutNavItemsFilter;
                this.WelcomeName = "";
                this.IsLoggedIn = false;
            }
            SelectedItem = (NavItemViewModel?)navItemsView.CurrentItem;

        }
        if (message.Sender.GetType() == typeof(DataService) &&
                message.PropertyName == nameof(DataService.IsInProgress))
        {
            DialogMessage = "Wait...";
            IsInProgress = message.NewValue;
        }

    }

    public void Receive(DataErrorMessage message)
    {
        Exception ex = message.Value;
        Console.WriteLine("ex: " + ex);

        IsInProgress = false;
        DialogMessage = ex.Message;
        DialogIsOpen = true;
    }

    [RelayCommand]
    public void CloseDialog()
    {
        DialogIsOpen = false;
    }


    private static void ModifyTheme(bool isDarkTheme)
    {
        var paletteHelper = new PaletteHelper();
        var theme = paletteHelper.GetTheme();

        theme.SetBaseTheme(isDarkTheme ? Theme.Dark : Theme.Light);
        paletteHelper.SetTheme(theme);
    }

    [RelayCommand]
    public void AboutBox()
    {
        DialogMessage = "Library Information System Demo Application 3.2";
        DialogIsOpen = true;
    }

    [RelayCommand]
    public void Logout()
    {
        navigation.NavigateTo<LogoutViewModel>();
    }

    [RelayCommand]
    public async Task Reload()
    {
        await dataService.LoadData();
        navigation.NavigateTo<BookListViewModel>();
    }
}


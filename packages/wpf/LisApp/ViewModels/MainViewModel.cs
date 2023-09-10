using CommunityToolkit.Mvvm.ComponentModel;
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

namespace LisApp.ViewModels;

public partial class MainViewModel: ViewModelBase, IRecipient<PropertyChangedMessage<bool>>, IRecipient<DataErrorMessage>
{
    private INavigationService navigation;
    private readonly ICollectionView _navItemsView;
    public ObservableCollection<NavItemViewModel> NavItems { get; }

    [ObservableProperty]
    private string appTitle = "The App";

    [ObservableProperty]
    private int selectedIndex;

    [ObservableProperty]
    private NavItemViewModel? selectedItem;

    [ObservableProperty]
    private bool dialogIsOpen = false;

    [ObservableProperty]
    private string dialogMessage = "";

    [ObservableProperty]
    private bool _isInProgress = false;

    public MainViewModel(INavigationService  _navigation)
    {
        navigation = _navigation;
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
                typeof(AuthorListViewModel),
                selectedIcon: PackIconKind.Books,
                unselectedIcon: PackIconKind.Books
            ),
            new NavItemViewModel(
                "Authors",
                typeof(AuthorListViewModel),
                selectedIcon: PackIconKind.PeopleGroup,
                unselectedIcon: PackIconKind.PeopleGroupOutline
            ),
            new NavItemViewModel(
                "Logout",
                typeof(AuthorListViewModel),
                selectedIcon: PackIconKind.LanDisconnect,
                unselectedIcon: PackIconKind.LanDisconnect
            )
        };
        SelectedItem = NavItems[0];
        SelectedIndex = 0;

        _navItemsView = CollectionViewSource.GetDefaultView(NavItems);
        _navItemsView.Filter = LoggedOutNavItemsFilter;
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

            if(message.NewValue)
            {
                _navItemsView.Filter = LoggedInNavItemsFilter;
            } else
            {
                _navItemsView.Filter = LoggedOutNavItemsFilter;
            }
            SelectedIndex = 0;

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
}


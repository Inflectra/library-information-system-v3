using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;
using System.Windows;
using System.Windows.Input;
using LisApp.Properties;
using LisApp.Services;
using System.Security.Policy;
using static System.Net.Mime.MediaTypeNames;
using CommunityToolkit.Mvvm.Messaging;
using CommunityToolkit.Mvvm.Messaging.Messages;

namespace LisApp.ViewModels;

[ObservableRecipient]
public partial class LoginViewModel: ViewModelBase
{
    private readonly INavigationService navigation;
    private readonly DataService dataService;

    [ObservableProperty]
    string _message = "Login";

    [ObservableProperty]
    string _username;

    [ObservableProperty]
    string _url;

    public SecureString SecurePassword { private get; set; }

    public LoginViewModel(INavigationService navigation, DataService dataService)
    {
        this.navigation = navigation;
        this.dataService = dataService;
        Username = Settings.Default.User;
        this.Url = Settings.Default.Url;
        SecurePassword = new System.Net.NetworkCredential("", Settings.Default.Password).SecurePassword;
        this.Messenger = WeakReferenceMessenger.Default;
    }

    public string GetPassword()
    {
        return Settings.Default.Password;
    }


    [RelayCommand]
    public void NavigateLogin()
    {
        Settings.Default.Url = this.Url;
        Settings.Default.User = this.Username;
        Settings.Default.Password = new System.Net.NetworkCredential(string.Empty, SecurePassword).Password;
        Settings.Default.Save();
        dataService.Login();
    }
}

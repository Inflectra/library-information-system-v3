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

public partial class LogoutViewModel: ViewModelBase
{
    private readonly DataService dataService;

    [ObservableProperty]
    string _message = "Logout";

    public LogoutViewModel(DataService dataService)
    {
        this.dataService = dataService;
    }

    [RelayCommand]
    public void LogoutShown()
    {
        dataService.Disconnect();
    }

}

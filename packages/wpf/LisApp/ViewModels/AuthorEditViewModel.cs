using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using CommunityToolkit.Mvvm.Messaging;
using LisApp.Models;
using LisApp.Services;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LisApp.ViewModels;

[ObservableRecipient]
public partial class AuthorEditViewModel : ViewModelBase
{
    [ObservableProperty]
    string message = "Create Author";

    [ObservableProperty]
    string mainAction = "Create";

    [ObservableProperty]
    string mainActionIcon = "Plus";

    [ObservableProperty]
    private Author author;

    private readonly DataService dataService;
    private readonly INavigationService navigation;

    public AuthorEditViewModel(DataService dataService, INavigationService _navigation)
    {
        this.dataService = dataService;
        this.navigation = _navigation;
        this.Messenger = WeakReferenceMessenger.Default;
    }

    [RelayCommand]
    public void Loaded()
    {
        if (dataService.Author == null)
        {
            dataService.Author = new Author()
            {
                Id = 0
            };
            this.Message = "Create New Author";
            this.MainAction = "Create";
            this.MainActionIcon = "Plus";
        }
        else
        {
            this.Message = "Edit Author";
            this.MainAction = "Save";
            this.MainActionIcon = "ContentSave";
        }

        this.Author = dataService.Author;
    }


    [RelayCommand]
    public async void Back()
    {
        await dataService.LoadData();
        navigation.NavigateTo<AuthorListViewModel>();
    }

    [RelayCommand]
    public async void Save()
    {
        try
        {
            if(await dataService.SaveAuthor(this.Author))
            {
                navigation.NavigateTo<AuthorListViewModel>();
            }
        }
        catch (Exception ex)
        {

            Messenger.Send(new DataErrorMessage(ex));
        }
    }
}

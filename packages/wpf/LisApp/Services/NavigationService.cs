using CommunityToolkit.Mvvm.ComponentModel;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LisApp.ViewModels;

namespace LisApp.Services;

public interface INavigationService: INotifyPropertyChanged
{
    ViewModelBase? CurrentView { get; }
    void NavigateTo<T>() where T : ViewModelBase;
    void NavigateTo(Type viewType);
}
public partial class NavigationService : ObservableObject, INavigationService
{
    private readonly Func<Type, ViewModelBase> factory;
    
    ViewModelBase? currentView;
    public ViewModelBase? CurrentView { 
        get => currentView; 
        set {
            currentView = value;
            OnPropertyChanged();
        }
    }

    public NavigationService(Func<Type, ViewModelBase> factory)
    {
        this.factory = factory;
    }


    public void NavigateTo<T>() where T : ViewModelBase
    {
        NavigateTo(typeof(T));
    }

    public void NavigateTo(Type viewType)
    {
        var model = factory.Invoke(viewType);
        CurrentView = model;
    }
}


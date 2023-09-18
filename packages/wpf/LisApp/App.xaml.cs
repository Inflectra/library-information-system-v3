using CommunityToolkit.Mvvm.DependencyInjection;
using LisApp.Services;
using LisApp.ViewModels;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;

namespace LisApp
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        private readonly ServiceProvider _serviceProvider;

        public App()
        {
            IServiceCollection services = new ServiceCollection();

            services.AddSingleton<MainWindow>(provider =>
                new MainWindow
                {
                    DataContext = provider.GetRequiredService<MainViewModel>()
                }
            );

            services.AddSingleton<Func<Type, ViewModelBase>>(provider => modtype => (ViewModelBase)provider.GetRequiredService(modtype));
            services.AddSingleton<INavigationService, NavigationService>();
            services.AddSingleton<DataService>();

            services.AddSingleton<MainViewModel>();
            services.AddSingleton<LoginViewModel>();
            services.AddSingleton<LogoutViewModel>();
            services.AddSingleton<AuthorViewModel>();
            services.AddSingleton<AuthorEditViewModel>();
            services.AddSingleton<AuthorListViewModel>();
            services.AddSingleton<BookViewModel>();
            services.AddSingleton<BookEditViewModel>();
            services.AddSingleton<BookListViewModel>();


            _serviceProvider = services.BuildServiceProvider();
            Ioc.Default.ConfigureServices(_serviceProvider);

        }

        protected override void OnStartup(StartupEventArgs e)
        {
            var w = _serviceProvider.GetRequiredService<MainWindow>();
            w.Show();
            base.OnStartup(e);
        }
    }
}

using LisApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace LisApp.Views
{
    /// <summary>
    /// Interaction logic for AuthorListView.xaml
    /// </summary>
    public partial class AuthorListView : UserControl
    {
        public AuthorListView()
        {
            InitializeComponent();
        }

        private void dgAuthors_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if ((dgAuthors.SelectedItem != null) && (e.OriginalSource?.Equals(dgAuthors) ?? false))
            {
                dgAuthors.ScrollIntoView(dgAuthors.SelectedItem);
            }

        }
    }
}

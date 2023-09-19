using System;
using System.Globalization;
using System.Linq;
using System.Windows.Controls;

namespace LisApp.Domain;

public class OrgValidationRule : ValidationRule
{
    public override ValidationResult Validate(object value, CultureInfo cultureInfo)
    {
        string str = "" + value;
        if( string.IsNullOrWhiteSpace(str) )
        {
            return ValidationResult.ValidResult;
        }
        bool valid = str.All(char.IsLetterOrDigit) || Uri.IsWellFormedUriString(str, UriKind.Absolute);

        return !valid
            ? new ValidationResult(false, "Organization name or URL is expected")
            : ValidationResult.ValidResult;
    }
}
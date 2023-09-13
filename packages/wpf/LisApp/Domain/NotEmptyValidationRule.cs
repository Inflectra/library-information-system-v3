using System.Globalization;
using System.Windows.Controls;

namespace LisApp.Domain;

public class NotEmptyValidationRule : ValidationRule
{
    public override ValidationResult Validate(object value, CultureInfo cultureInfo)
    {
        if( value == null)
        {
            return new ValidationResult(false, "Value is required.");
        }
        if (value is int i)
        {
            return i<=0 ? new ValidationResult(false, "Value is required.")
                : ValidationResult.ValidResult;
        }
        return string.IsNullOrWhiteSpace((value ?? "").ToString())
            ? new ValidationResult(false, "Value is required.")
            : ValidationResult.ValidResult;
    }
}
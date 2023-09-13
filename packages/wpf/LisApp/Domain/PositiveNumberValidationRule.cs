using System;
using System.Globalization;
using System.Windows.Controls;

namespace LisApp.Domain;

public class PositiveNumberValidationRule : ValidationRule
{
    public override ValidationResult Validate(object value, CultureInfo cultureInfo)
    {

        if( Int32.TryParse(""+value, out int i) && i>0)
        {
            return ValidationResult.ValidResult;
        }
        return new ValidationResult(false, "Value is required.");
    }
}
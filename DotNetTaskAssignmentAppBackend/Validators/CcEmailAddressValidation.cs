using System.ComponentModel.DataAnnotations;


namespace DotNetTaskAssignmentAppBackend.Validators
{
    public class CcEmailAddressesValidation : ValidationAttribute
    {
        public ValidationResult IsValidCcString(object value)
        {
            var ccEmailAddresses = value as string;
            if (string.IsNullOrEmpty(ccEmailAddresses))
            {
                return ValidationResult.Success;
            }

            var emails = ccEmailAddresses.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries);
            var invalidEmails = emails.Where(email => !new EmailAddressAttribute().IsValid(email.Trim())).ToList();

            if (invalidEmails.Any())
            {
                var invalidEmailsJoined = string.Join(", ", invalidEmails);
                return new ValidationResult($"Invalid CC email addresses: {invalidEmailsJoined}");
            }

            return ValidationResult.Success;
        }
    }
}

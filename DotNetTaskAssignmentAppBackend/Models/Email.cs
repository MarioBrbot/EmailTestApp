using System.ComponentModel.DataAnnotations;

namespace DotNetTaskAssignmentAppBackend.Models
{
    public class Email
    {
        public string FromEmailAddress { get; set; }

        public string ToEmailAddress { get; set; }
     
        public string CcEmailAddresses { get; set; }

        public string Subject { get; set; }

        public string Importance { get; set; }

        public string EmailContent { get; set; }

        public int Id { get; set; }

        public DateTime SentDate { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}

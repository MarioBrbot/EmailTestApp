namespace DotNetTaskAssignmentAppBackend.DTOs
{
    public class EmailDto
    {
        public string FromEmailAddress { get; set; }
        public string ToEmailAddress { get; set; }
        public string CcEmailAddresses { get; set; }
        public string Subject { get; set; }
        public string Importance { get; set; }
        public string EmailContent { get; set; }
    }
}

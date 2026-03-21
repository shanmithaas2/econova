import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def send_email(to_email: str, subject: str, body: str):
    try:
        sender = os.getenv("GMAIL_USER")
        password = os.getenv("GMAIL_PASSWORD")

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"EcoNova 🌿 <{sender}>"
        msg["To"] = to_email

        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background: #f9fafb; padding: 32px;">
          <div style="max-width: 520px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <div style="background: linear-gradient(135deg, #0a1f12, #16a34a); padding: 28px 32px;">
              <h1 style="color: white; margin: 0; font-size: 22px;">🌿 EcoNova</h1>
              <p style="color: rgba(255,255,255,0.7); margin: 6px 0 0; font-size: 13px;">Smart Waste Management</p>
            </div>
            <div style="padding: 28px 32px;">
              {body}
            </div>
            <div style="padding: 16px 32px; background: #f9fafb; border-top: 1px solid #f3f4f6;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">This is an automated message from EcoNova. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
        """

        msg.attach(MIMEText(html, "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender, password)
            server.sendmail(sender, to_email, msg.as_string())

        print(f"Email sent to {to_email}")
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False


def email_welcome(to_email: str, name: str):
    send_email(
        to_email,
        "Welcome to EcoNova! 🌿",
        f"""
        <h2 style="color: #0a1f12;">Welcome, {name}! 👋</h2>
        <p style="color: #374151; line-height: 1.6;">
          Thank you for joining EcoNova — your smart waste management platform.
          Together we can make our city cleaner and greener!
        </p>
        <div style="background: #f0fdf4; border-radius: 10px; padding: 16px; margin: 20px 0;">
          <p style="color: #16a34a; font-weight: bold; margin: 0 0 8px;">What you can do:</p>
          <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Report waste and earn points</li>
            <li>Schedule waste pickups</li>
            <li>Track your carbon footprint</li>
            <li>Buy and sell recyclables on the marketplace</li>
          </ul>
        </div>
        <a href="http://localhost:3000/citizen-dashboard"
           style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
          Go to Dashboard →
        </a>
        """
    )


def email_pickup_scheduled(to_email: str, name: str, waste_type: str, date: str, location: str):
    send_email(
        to_email,
        "Pickup Scheduled! 🚛",
        f"""
        <h2 style="color: #0a1f12;">Pickup Confirmed! 🚛</h2>
        <p style="color: #374151;">Hi {name}, your waste pickup has been scheduled successfully.</p>
        <div style="background: #f0fdf4; border-radius: 10px; padding: 20px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="color: #6b7280; padding: 6px 0; font-size: 13px;">Waste Type</td>
                <td style="font-weight: bold; color: #0a1f12;">{waste_type}</td></tr>
            <tr><td style="color: #6b7280; padding: 6px 0; font-size: 13px;">Preferred Date</td>
                <td style="font-weight: bold; color: #0a1f12;">{date}</td></tr>
            <tr><td style="color: #6b7280; padding: 6px 0; font-size: 13px;">Location</td>
                <td style="font-weight: bold; color: #0a1f12;">{location}</td></tr>
          </table>
        </div>
        <p style="color: #6b7280; font-size: 13px;">Our team will arrive on the scheduled date. You will earn bonus points after completion!</p>
        """
    )


def email_complaint_resolved(to_email: str, name: str, complaint_desc: str):
    send_email(
        to_email,
        "Your Complaint Has Been Resolved ✅",
        f"""
        <h2 style="color: #0a1f12;">Complaint Resolved! ✅</h2>
        <p style="color: #374151;">Hi {name}, your complaint has been resolved by our municipal team.</p>
        <div style="background: #f0fdf4; border-radius: 10px; padding: 16px; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 13px; margin: 0 0 6px;">Your complaint:</p>
          <p style="color: #0a1f12; font-style: italic; margin: 0;">"{complaint_desc}"</p>
        </div>
        <p style="color: #374151;">Thank you for helping keep our city clean! 🌿</p>
        """
    )


def email_bin_alert(to_email: str, zone: str, fill_level: int):
    send_email(
        to_email,
        f"ALERT: Bin in {zone} is {fill_level}% Full 🚨",
        f"""
        <h2 style="color: #dc2626;">Bin Alert! 🚨</h2>
        <p style="color: #374151;">A waste bin in your zone has reached critical fill level.</p>
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 20px; margin: 20px 0;">
          <p style="font-size: 32px; font-weight: bold; color: #dc2626; margin: 0 0 8px;">{fill_level}%</p>
          <p style="color: #7f1d1d; margin: 0;">Zone: <strong>{zone}</strong> — Immediate pickup required!</p>
        </div>
        <p style="color: #6b7280; font-size: 13px;">A pickup request has been automatically created in the system.</p>
        """
    )
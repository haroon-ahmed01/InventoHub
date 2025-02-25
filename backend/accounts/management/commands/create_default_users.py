from django.core.management.base import BaseCommand
from accounts.models import User

class Command(BaseCommand):
    help = 'Creates default admin and staff users'

    def handle(self, *args, **kwargs):
        # Create admin user
        if not User.objects.filter(username='admin').exists():
            User.objects.create_user(
                username='admin',
                email='admin@example.com',
                password='admin123',
                user_type='admin'
            )
            self.stdout.write(self.style.SUCCESS('Successfully created admin user'))

        # Create staff user
        if not User.objects.filter(username='staff').exists():
            User.objects.create_user(
                username='staff',
                email='staff@example.com',
                password='staff123',
                user_type='staff'
            )
            self.stdout.write(self.style.SUCCESS('Successfully created staff user')) 
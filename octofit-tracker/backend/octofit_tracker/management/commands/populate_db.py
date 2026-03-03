from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Delete existing data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()

        # Create teams
        marvel = Team.objects.create(name='Marvel', members=['Iron Man', 'Captain America', 'Thor', 'Hulk'])
        dc = Team.objects.create(name='DC', members=['Superman', 'Batman', 'Wonder Woman', 'Flash'])

        # Create users
        users = [
            User(username='ironman', email='ironman@marvel.com', team='Marvel'),
            User(username='cap', email='cap@marvel.com', team='Marvel'),
            User(username='thor', email='thor@marvel.com', team='Marvel'),
            User(username='hulk', email='hulk@marvel.com', team='Marvel'),
            User(username='superman', email='superman@dc.com', team='DC'),
            User(username='batman', email='batman@dc.com', team='DC'),
            User(username='wonderwoman', email='wonderwoman@dc.com', team='DC'),
            User(username='flash', email='flash@dc.com', team='DC'),
        ]
        User.objects.bulk_create(users)

        # Create activities
        Activity.objects.create(user='ironman', type='run', duration=30)
        Activity.objects.create(user='cap', type='cycle', duration=45)
        Activity.objects.create(user='thor', type='swim', duration=25)
        Activity.objects.create(user='hulk', type='lift', duration=60)
        Activity.objects.create(user='superman', type='fly', duration=120)
        Activity.objects.create(user='batman', type='run', duration=40)
        Activity.objects.create(user='wonderwoman', type='jump', duration=35)
        Activity.objects.create(user='flash', type='sprint', duration=10)

        # Create leaderboard
        Leaderboard.objects.create(team='Marvel', points=160)
        Leaderboard.objects.create(team='DC', points=205)

        # Create workouts
        Workout.objects.create(name='Pushups', description='Do 20 pushups', suggested_for=['Marvel', 'DC'])
        Workout.objects.create(name='Sprints', description='Sprint for 100m', suggested_for=['Flash'])
        Workout.objects.create(name='Flying', description='Fly for 10 minutes', suggested_for=['Superman'])

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data'))

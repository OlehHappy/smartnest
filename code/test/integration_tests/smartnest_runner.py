__author__ = 'juraj'
import os

from salsa_webqa.salsa_runner import SalsaRunner


class SmartNestRunner(SalsaRunner):
    """ Dedicated project runner, extends general SalsaRunner """

    def __init__(self):
        self.project_root = os.path.dirname(os.path.abspath(__file__))
        SalsaRunner.__init__(self, self.project_root)


runner = SmartNestRunner()
runner.run_tests()
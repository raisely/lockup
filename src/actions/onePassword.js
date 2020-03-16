const { pick } = require('lodash/pick');
const Action = require('../action');
const { exec } = require('../util/system');
const { log } = require('../util/helpers');

class OnePassword extends Action {
	/**
	 * Get account details for one or more 1password accounts
	 * @param {*} helpers
	 */
	async interview(helpers) {
		const { inquirer } = helpers;
		let answer;
		const accounts = [];
		do {
			answer = await inquirer
				.prompt([
					{
						type: 'text',
						name: 'domain',
						message: 'Enter your One Password domain',
						default: 'my.1password.com',
					}, {
						type: 'text',
						name: 'email',
						message: 'Enter your email for this domain',
					}, {
						type: 'confirm',
						name: 'another',
						message: 'Do you wish to setup another One Password account?',
					}
				]);
			accounts.push(pick(answer, ['domain', 'email']));
		} while (answer.another);
		return { accounts };
	}

	/**
	 * Get session tokens for one password before cleaning starts
	 */
	async beforeClean(helpers) {
		this.sessions = await this.getSessions(helpers);
	}

	/**
	 * Switch off travel mode before restore
	 */
	async beforeRestore(helpers) {
		this.sessions = await this.getSessions(helpers);
		// Disable travel mode
		await this.setTravelMode(helpers, this.sessions, false);
	}
	/**
	 * Switch on travel mode after cleaning
	 */
	async afterClean(helpers) {
		await this.setTravelMode(helpers, this.sessions, true);
	}

	/**
	 * Iterate over all accounts and set travel mode to off or on
	 * Will run concurrently for multiple accounts
	 * @param {object} helpers { ora, inquirer }
	 * @param {object[]} accounts Account definitons
	 * @param {*} enabled If travel mode should be switched on or off
	 */
	async setTravelMode(helpers, accounts, enabled) {
		const { ora } = helpers;
		let spinner = ora(`Compressing files to preserve`).start();
		try {
			await Promise.all(accounts.map(account => {
				const command = `op edit user ${account.email} --account ${account.prefix} --travelmode ${enabled ? 'on' : 'off'}`;
				return exec(command, {
					env: account.session,
				});
			}));
			spinner.succeed();
		} catch (e) {
			spinner.fail();
			throw e;
		}
	}

	/**
	 * Get a session token for use in calling other one password commands
	 * Will likely require user to enter their password so will hand
	 * stdin over to the shell
	 * @returns {object[]} Of form { domain, email, prefix, session }
	 */
	async getSessions() {
		const accountsWithSession = [];
		log('Getting session key for 1password accounts ...');
		for (const index in this.config.accounts) {
			const account = this.config.accounts[index];
			const { domain, email } = account;
			const prefix = this.getDomainPrefix(account.domain);
			const envKey = `OP_SESSION_${prefix}`;
			let value = process.env[envKey];
			if (!value) {
				const signin = await exec(`op signin ${domain} ${email} --raw`, { stdin: process.stdin });
				value = signin.stdout.toString();
			}
			const session = {};
			session[envKey] = value;

			accountsWithSession.push({
				domain,
				email,
				prefix,
				session,
			});
		}
		return accountsWithSession;
	}

	/**
	 * Get the subdomain for a given domain (eg my, raisely)
	 * @param {string} domain
	 * @return {string}
	 */
	getDomainPrefix(domain) {
		return domain.split('.')[0];
	}
}

module.exports = OnePassword;

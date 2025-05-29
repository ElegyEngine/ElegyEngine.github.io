
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './wipnotice.module.css'

export default function WipNotice(): JSX.Element {
	return (
	<div className='row'>
		<p className={clsx('col col--12 hero__subtitle text--center', styles.wipBox)}>
			<b>Note:</b> This engine is a very early work in progress! 🛠 <br/>
			Check out the <Link to='/blog'>development articles</Link> and the <Link to='/docs/roadmap'>roadmap</Link>.
		</p>
	</div>
	);
  }

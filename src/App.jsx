import { useState, useEffect, useCallback } from 'react';
import { FiUsers, FiUserCheck, FiRefreshCw } from 'react-icons/fi';
import confetti from 'canvas-confetti';
import JsonInputCard from './components/JsonInputCard';
import ResultList from './components/ResultList';
import Toast from './components/Toast';
import { normalizeJsonInput, findNonFollowers } from './utils/jsonParser';
import { saveFollowers, saveFollowing, saveResults, loadFollowers, loadFollowing, loadResults } from './utils/storage';

function App() {
  const [followersJson, setFollowersJson] = useState('');
  const [followingJson, setFollowingJson] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [followersValid, setFollowersValid] = useState(false);
  const [followingValid, setFollowingValid] = useState(false);
  const [hasRunComparison, setHasRunComparison] = useState(false);
  const [magicPhrase, setMagicPhrase] = useState('');
  
  const REQUIRED_PHRASE = 'i am obsessed with my handsom eng.Ahed';

  // Load persisted data on mount
  useEffect(() => {
    const savedFollowers = loadFollowers();
    const savedFollowing = loadFollowing();
    const savedResults = loadResults();

    if (savedFollowers) setFollowersJson(savedFollowers);
    if (savedFollowing) setFollowingJson(savedFollowing);
    if (savedResults.length > 0) {
      setResults(savedResults);
      setHasRunComparison(true);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (followersJson) saveFollowers(followersJson);
  }, [followersJson]);

  useEffect(() => {
    if (followingJson) saveFollowing(followingJson);
  }, [followingJson]);

  useEffect(() => {
    if (results.length > 0) saveResults(results);
  }, [results]);

  // Trigger confetti celebration when results appear
  useEffect(() => {
    if (results.length > 0 && !isLoading) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }, 300);
    }
  }, [results.length, isLoading]);

  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type });
  }, []);

  const handleCompare = useCallback(async () => {
    if (!followersValid || !followingValid) {
      showToast('Please fix JSON errors before comparing 😅');
      return;
    }

    if (!followersJson.trim() || !followingJson.trim()) {
      showToast('Both JSON inputs are required ⚠️');
      return;
    }

    setIsLoading(true);

    // Simulate async processing for smooth UX
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const followersResult = normalizeJsonInput(followersJson);
      const followingResult = normalizeJsonInput(followingJson);

      if (!followersResult.success) {
        showToast(`Followers JSON error: ${followersResult.error}`);
        setIsLoading(false);
        return;
      }

      if (!followingResult.success) {
        showToast(`Following JSON error: ${followingResult.error}`);
        setIsLoading(false);
        return;
      }

      const nonFollowers = findNonFollowers(followingResult.data, followersResult.data);
      setResults(nonFollowers);
      setHasRunComparison(true);
      
      if (nonFollowers.length === 0) {
        showToast('🎉 Everyone you follow also follows you back!', 'success');
      } else {
        showToast(`Found ${nonFollowers.length} users who don't follow you back 🔥`, 'success');
      }
    } catch (error) {
      showToast(`Error during comparison: ${error.message} ⚠️`);
    } finally {
      setIsLoading(false);
    }
  }, [followersJson, followingJson, followersValid, followingValid, showToast]);

  const handleRemoveUser = useCallback((username) => {
    setResults(prev => {
      const updated = prev.filter(u => u !== username);
      saveResults(updated);
      return updated;
    });
  }, []);

  const canCompare = followersValid && followingValid && followersJson.trim() && followingJson.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 py-6 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Unfollow App 😊
          </h1>
          <p className="text-base-content/70">
            Find users who don't follow you back
          </p>
        </div>

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Input Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <JsonInputCard
            title="Followers 👥"
            icon={FiUsers}
            placeholder='Paste your followers JSON here...\n\nExamples:\n["user1", "user2"]\n\nOr Instagram export format'
            value={followersJson}
            onChange={setFollowersJson}
            onValidationChange={setFollowersValid}
          />

          <JsonInputCard
            title="Following ✨"
            icon={FiUserCheck}
            placeholder='Paste your following JSON here...\n\nExamples:\n["user1", "user2"]\n\nOr Instagram export format'
            value={followingJson}
            onChange={setFollowingJson}
            onValidationChange={setFollowingValid}
          />
        </div>

        {/* Magic Phrase Input */}
        <div className="card bg-base-200 shadow-md rounded-xl p-4 md:p-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold text-lg">
                Type the magic phrase to unlock comparison 🔓
              </span>
            </label>
            <input
              type="text"
              placeholder="I am obsessed with my handsom eng.Ahed"
              value={magicPhrase}
              onChange={(e) => setMagicPhrase(e.target.value)}
              className={`input input-bordered rounded-xl transition-all duration-200 ${
                magicPhrase.toLowerCase().trim() === REQUIRED_PHRASE.toLowerCase()
                  ? 'input-success focus:ring-2 focus:ring-success'
                  : 'focus:ring-2 focus:ring-primary'
              }`}
            />
            {magicPhrase && magicPhrase.toLowerCase().trim() !== REQUIRED_PHRASE.toLowerCase() && (
              <label className="label">
                <span className="label-text-alt text-error">
                  ⚠️ Incorrect phrase. Try again!  😅
                </span>
              </label>
            )}
            {magicPhrase.toLowerCase().trim() === REQUIRED_PHRASE.toLowerCase() && (
              <label className="label">
                <span className="label-text-alt text-success">
                  ✅ Correctt! You can now compare! 🎉
                </span>
              </label>
            )}
          </div>
        </div>

        {/* Compare Button */}
        <div className="flex justify-center">
          <button
            onClick={handleCompare}
            disabled={!canCompare || isLoading || magicPhrase.toLowerCase().trim() !== REQUIRED_PHRASE.toLowerCase()}
            className={`btn btn-primary btn-lg rounded-xl shadow-lg transition-all duration-200 ${
              canCompare && !isLoading && magicPhrase.toLowerCase().trim() === REQUIRED_PHRASE.toLowerCase()
                ? 'hover:shadow-xl hover:scale-105'
                : 'btn-disabled'
            }`}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Comparing...
              </>
            ) : (
              <>
                <FiRefreshCw className="text-xl" />
                Compare & Find Non-Followers 🔥
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {(hasRunComparison || isLoading || results.length > 0) && (
          <ResultList
            results={results}
            isLoading={isLoading}
            onRemoveUser={handleRemoveUser}
          />
        )}
      </div>
    </div>
  );
}

export default App;

